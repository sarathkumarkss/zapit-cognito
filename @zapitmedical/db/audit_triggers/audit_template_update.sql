CREATE TRIGGER ?_update
AFTER UPDATE ON `?`
  FOR EACH ROW
  BEGIN
    INSERT INTO ?_audit SELECT null,'update',NEW.user_updated_id,NOW(),`?`.* FROM `?` WHERE id = NEW.id;
  END;
