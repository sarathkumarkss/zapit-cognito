CREATE TRIGGER ?_create
AFTER INSERT ON `?`
  FOR EACH ROW
  BEGIN
    INSERT INTO ?_audit SELECT null,'create',NEW.user_created_id,NOW(),`?`.* FROM `?` WHERE id = NEW.id;
  END;
