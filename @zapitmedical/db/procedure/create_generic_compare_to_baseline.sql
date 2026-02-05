DELIMITER $$
  DROP PROCEDURE IF EXISTS create_generic_compare_to_baseline $$
  CREATE PROCEDURE create_generic_compare_to_baseline (IN machine_type_id INT)
  BEGIN
    SET @test_number = 1;
    WHILE @test_number <= 10 DO
      INSERT INTO test SET name = CONCAT("generic_compare_to_baseline_",@test_number), machine_type_id = machine_type_id, created_at = NOW(), updated_at = NOW();
      SET @test_id = LAST_INSERT_ID();
      INSERT INTO test_version SET test_id = @test_id, version = 1, label = CONCAT('Generic Compare to Baseline #',@test_number), created_at = NOW(), updated_at = NOW();
      SET @test_version_id = LAST_INSERT_ID();

      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'value_name', type = 'org_param', label = 'Value Name', created_at = NOW(), updated_at = NOW();
      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'units', type = 'org_param', label = 'Units', created_at = NOW(), updated_at = NOW();
      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'baseline', type = 'org_param', label = 'Baseline', created_at = NOW(), updated_at = NOW();
      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'pass_fail_method', type = 'org_param', label = 'Pass/Fail Method', created_at = NOW(), updated_at = NOW(), xtype = 'combo';
      SET @combo_field_id = LAST_INSERT_ID();
      INSERT INTO test_field_combo_value SET test_field_id = @combo_field_id, label = '% difference from baseline', value = 'pct_difference_from_baseline', created_at = NOW(), updated_at = NOW();
      INSERT INTO test_field_combo_value SET test_field_id = @combo_field_id, label = 'Upper/Lower Limit', value = 'upper_lower_limit', created_at = NOW(), updated_at = NOW();
      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'upper_limit', type = 'org_param', label = 'Upper Limit', created_at = NOW(), updated_at = NOW(), active_if_old = "pass_fail_method === 'upper_lower_limit'";
      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'lower_limit', type = 'org_param', label = 'Lower Limit', created_at = NOW(), updated_at = NOW(), active_if_old = "pass_fail_method === 'upper_lower_limit'";
      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'pct_difference_pass_fail_criteria', type = 'org_param', label = '% difference from baseline pass/fail criteria', created_at = NOW(), updated_at = NOW(), active_if_old = "pass_fail_method === 'pct_difference_from_baseline'";

      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'input_value', type = 'input', label = 'value_name', units = 'units', eval_units = 1, created_at = NOW(), updated_at = NOW();
      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'pct_difference_from_baseline', formula = "(input_value - baseline) / baseline * 100 ", type = 'calc', label = '% Difference from baseline', units = '%', active_if_old = "pass_fail_method === 'pct_difference_from_baseline'", created_at = NOW(), updated_at = NOW();
      INSERT INTO test_field SET test_version_id = @test_version_id, name = 'difference_from_baseline', type = 'calc', label = 'Difference from baseline', formula = "input_value - baseline", units = 'units', eval_units = 1, active_if_old = "pass_fail_method === 'upper_lower_limit'", created_at = NOW(), updated_at = NOW();

      INSERT INTO test_field SET test_version_id = @test_version_id, created_at = NOW(), updated_at = NOW(), name = 'pass_fail_calc', formula = "pass_fail_method === 'pct_difference_from_baseline' ? (Math.abs(pct_difference_from_baseline) <= pct_difference_pass_fail_criteria) : (input_value <= upper_limit && input_value >= lower_limit)";
      SET @test_number = @test_number + 1;
    END WHILE;
  END $$
DELIMITER ;
