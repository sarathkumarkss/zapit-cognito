DELIMITER $$
  DROP PROCEDURE IF EXISTS create_generic_checklist_tests $$
  CREATE PROCEDURE create_generic_checklist_tests (IN machine_type_id INT)
  BEGIN
    SET @test_number = 1;
    WHILE @test_number <= 10 DO
      INSERT INTO test SET name = CONCAT("generic_checklist_",@test_number), machine_type_id = machine_type_id, created_at = NOW(), updated_at = NOW();
      SET @test_id = LAST_INSERT_ID();
      INSERT INTO test_version SET test_id = @test_id, version = 1, label = CONCAT('Generic Checklist #',@test_number), created_at = NOW(), updated_at = NOW();
      SET @test_version_id = LAST_INSERT_ID();
      SET @x = 1;
      WHILE @x <= 10 DO
        INSERT INTO test_field SET test_version_id = @test_version_id, name = CONCAT('name_',@x), type = 'org_param', created_at = NOW(), updated_at = NOW();
        INSERT INTO test_field SET test_version_id = @test_version_id, name = CONCAT('other_',@x), type = 'org_param', created_at = NOW(), updated_at = NOW();

        INSERT INTO test_field SET test_version_id = @test_version_id, name = CONCAT('val_',@x), type = 'input', xtype = 'radio', active_if_old = CONCAT("typeof name_",@x," !== 'undefined' && name_",@x," !== '' && name_",@x," !== null"), created_at = NOW(), updated_at = NOW();
        INSERT INTO test_field SET test_version_id = @test_version_id, name = CONCAT('val_',@x,"_other"), type = 'input', active_if_old = CONCAT("typeof other_",@x," !== 'undefined' && other_",@x," !== '' && other_",@x," !== null"), created_at = NOW(), updated_at = NOW();
        SET @radio_field_id = LAST_INSERT_ID();
        INSERT INTO test_field_combo_value SET test_field_id = @radio_field_id, label = 'Pass', value = 'pass', created_at = NOW(), updated_at = NOW();
        INSERT INTO test_field_combo_value SET test_field_id = @radio_field_id, label = 'Fail', value = 'fail', created_at = NOW(), updated_at = NOW();
        SET @x = @x + 1;
      END WHILE;

      INSERT INTO test_field SET test_version_id = @test_version_id, created_at = NOW(), updated_at = NOW(), name = 'pass_fail_calc', formula = "(name_1 ? val_1 === 'pass' : true) && (name_2 ? val_2 === 'pass' : true) && (name_3 ? val_3 === 'pass' : true) && (name_4 ? val_4 === 'pass' : true) && (name_5 ? val_5 === 'pass' : true) && (name_6 ? val_6 === 'pass' : true) && (name_7 ? val_7 === 'pass' : true) && (name_8 ? val_8 === 'pass' : true) && (name_9 ? val_9 === 'pass' : true) && (name_10 ? val_10 === 'pass' : true)";
      SET @test_number = @test_number + 1;
    END WHILE;
  END $$
DELIMITER ;
