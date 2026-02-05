SELECT
  CONCAT(machine.id, '_', test.id) id,
  tr.max_test_date
FROM machine
JOIN (
  SELECT machine.id machine_id, test_version.test_id, MAX(test_date) max_test_date
  FROM test_run
  JOIN test_version ON test_run.test_version_id = test_version.id
  JOIN machine ON test_run.machine_id = machine.id
  GROUP BY machine.id, test_version.test_id
) tr ON tr.machine_id = machine.id
JOIN test ON tr.test_id = test.id
GROUP BY machine.id, test.id
LIMIT 10;
