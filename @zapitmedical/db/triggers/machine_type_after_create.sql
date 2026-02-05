DELIMITER $$
  DROP TRIGGER IF EXISTS machine_type_after_create $$
  CREATE TRIGGER machine_type_after_create AFTER INSERT ON machine_type
  FOR EACH ROW
  BEGIN
    CALL create_generic_checklist_tests(NEW.id);
    CALL create_generic_compare_to_baseline(NEW.id);
  END $$
DELIMITER ;
