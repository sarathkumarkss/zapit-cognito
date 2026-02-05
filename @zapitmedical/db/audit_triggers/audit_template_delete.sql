CREATE TRIGGER ?_delete
AFTER DELETE ON `?`
  FOR EACH ROW
  BEGIN
    INSERT INTO ?_audit SELECT null,'delete',OLD.user_deleted_id,NOW(),`?`.* FROM `?` WHERE id = OLD.id;
  END;
