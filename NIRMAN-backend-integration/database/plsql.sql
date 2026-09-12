//exception handling
CREATE OR REPLACE FUNCTION fn_validate_password (p_password IN VARCHAR2)
RETURN NUMBER
IS
BEGIN
    IF LENGTH(p_password) < 6 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Password must contain at least 6 characters.');
    END IF;
    RETURN 1;
END fn_validate_password;
//resulotion
CREATE OR REPLACE PROCEDURE resolve_complaint_proc (
    p_complaint_id IN VARCHAR2,
    p_resolution   IN VARCHAR2,
    p_emp_id       IN VARCHAR2
)
IS
BEGIN

    IF LENGTH(TRIM(p_resolution)) < 10
       OR LENGTH(p_resolution) > 500 THEN

        RAISE_APPLICATION_ERROR(
            -20002,
            'Resolution must be between 10 and 500 characters.'
        );

    END IF;

    UPDATE Complaints
    SET Status = 'Resolved',
        Resolution = p_resolution,
        Resolved_by_Emp_id = p_emp_id
    WHERE Complaint_id = p_complaint_id;

END;
//cursor+Exception Handling — Complaint resolution (Procedure)
CREATE OR REPLACE PROCEDURE resolve_complaint_proc (
    p_complaint_id IN VARCHAR2,
    p_resolution   IN VARCHAR2,
    p_emp_id       IN VARCHAR2
)
IS
    CURSOR complaint_cursor IS
        SELECT Status FROM Complaints WHERE Complaint_id = p_complaint_id;
    v_status Complaints.Status%TYPE;
BEGIN
    IF LENGTH(TRIM(p_resolution)) < 10 OR LENGTH(p_resolution) > 500 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Resolution must be between 10 and 500 characters.');
    END IF;

    OPEN complaint_cursor;
    FETCH complaint_cursor INTO v_status;
    IF complaint_cursor%NOTFOUND THEN
        CLOSE complaint_cursor;
        RAISE_APPLICATION_ERROR(-20003, 'Complaint not found.');
    END IF;
    CLOSE complaint_cursor;

    IF v_status = 'Resolved' THEN
        RAISE_APPLICATION_ERROR(-20004, 'This complaint is already resolved.');
    END IF;

    UPDATE Complaints
    SET Status = 'Resolved', Resolution = p_resolution, Resolved_by_Emp_id = p_emp_id
    WHERE Complaint_id = p_complaint_id;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20005, 'Complaint not found.');
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20099, 'Unexpected error: ' || SQLERRM);
END resolve_complaint_proc;
//abstract datatype
CREATE OR REPLACE TYPE Address_Type AS OBJECT (
    House_No    NUMBER,
    Road_Sector VARCHAR2(80),
    City        VARCHAR2(30)
);
/

CREATE OR REPLACE FUNCTION get_area_full_address(p_area_id VARCHAR2) RETURN VARCHAR2
IS
    v_addr Address_Type;
BEGIN
    SELECT Address_Type(House_No, Road_Sector, 'Dhaka') INTO v_addr
    FROM Area WHERE Area_id = p_area_id;
    RETURN 'House ' || v_addr.House_No || ', ' || v_addr.Road_Sector || ', ' || v_addr.City;
END;
/
