ALTER TABLE Person MODIFY (Password VARCHAR2(255));

UPDATE Person SET Password = '$2y$10$9iGWGyGSp0292cdZZ/JkQu4CFSgQ.PitvDlcTpjbUtAhUybN82/NW' WHERE Person_id = 'P001' AND Password = 'employee123';
UPDATE Person SET Password = '$2y$10$x4MWWar2ZDkdKIlFMfuwW.2b/QwVMbAD9xaf.ffkH.8yrukjrtVxW' WHERE Person_id = 'P002' AND Password = 'employee123';
UPDATE Person SET Password = '$2y$10$WO2tJKQmUEhQZe0Yb6n5P.lDNthI8EMR/HqQkmIyaN5qU3Aj.7Xv2' WHERE Person_id = 'P003' AND Password = 'employee123';
UPDATE Person SET Password = '$2y$10$SOMbtxOPF3abWM6ft6CWgOwMVjKvigjUgp2iJCpdzfu2e/QmaDXFe' WHERE Person_id = 'P004' AND Password = 'client123';
UPDATE Person SET Password = '$2y$10$apMojgnq6z2Q.vQIB3zbHeEwRSNSgoW8Fh1Vm0dmSLWYhaaIjjUNq' WHERE Person_id = 'P005' AND Password = 'client123';
UPDATE Person SET Password = '$2y$10$g4LFO66KyJoRIe06EEWc6Oc8O.0jVx4WN6vQDDkKhFA7KS7cXW.Tm' WHERE Person_id = 'P006' AND Password = 'contractor123';
UPDATE Person SET Password = '$2y$10$3qctExO2so8ztLmtqu08FeZcnjVdxivX6QjxSVQ4JXs3t7RXrAp5K' WHERE Person_id = 'P007' AND Password = 'contractor123';
UPDATE Person SET Password = '$2y$10$J2XLEsdMzhTDAuGnVfbeuO/h7oqJe2A.AbkzYqyB2mz8Ts4oesWcy' WHERE Person_id = 'P008' AND Password = 'employee123';
UPDATE Person SET Password = '$2y$10$BpmAYzv.C/A6f61QmzKU9uFLxlPOEmlSiqxnTNlq3bc8LXYt3xZZO' WHERE Person_id = 'P009' AND Password = 'client123';
UPDATE Person SET Password = '$2y$10$I.iBdhPGdJQCg7baS3y0hOuVC.DRGTKRbk9UZHGdwXIjBXbG8ZJgu' WHERE Person_id = 'P010' AND Password = 'contractor123';
UPDATE Person SET Password = '$2y$10$FNP8FwfdvcLnsTgyrBXWq.o8su6eGADX5opY4xj5TtRnBKSCrPP0u' WHERE Person_id = 'P011' AND Password = 'contractor123';
UPDATE Person SET Password = '$2y$10$RvR285YlIa8RiNIxhr5iee62ec7f6vJL181sQlQrktY9NI/cfycAu' WHERE Person_id = 'P012' AND Password = 'contractor123';
UPDATE Person SET Password = '$2y$10$Bw.XSv88U4So7sk94kIC1uswuNRroYkqP0qAqNEAjmQgNJsNnHJhm' WHERE Person_id = 'P013' AND Password = 'client123';
UPDATE Person SET Password = '$2y$10$uW6MW9T4CJ1inSsfIRlaY.w0597lhRWOEEGGe8p1tuc.Cj81ky2jm' WHERE Person_id = 'P014' AND Password = 'client123';
UPDATE Person SET Password = '$2y$10$pES67223VbaNvfy1PLUUle5tUMM2Ff0MfANX6LMrSCph5eszRKzey' WHERE Person_id = 'P015' AND Password = 'employee123';
UPDATE Person SET Password = '$2y$10$7JrDjTm5tU.MJEIjkqTQEu2T4/4aiOVWFfDgtQnYs9yS1RDuLYAlK' WHERE Person_id = 'P016' AND Password = 'employee123';
UPDATE Person SET Password = '$2y$10$o6SJB0lBKAMRbHaRZmlGpuaiqlVOnkLV9PI18WZU79X0mE07oq8M2' WHERE Person_id = 'P017' AND Password = 'admin123';

COMMIT;
