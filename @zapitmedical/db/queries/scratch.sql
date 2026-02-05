SELECT temp.machine_id, temp.tv_id, temp.parent_id, MAX(temp.td_max) td_max
FROM (
  SELECT machine.id machine_id, test_version.parent_id, test_version.id tv_id, MAX(IFNULL(test_date,DATE('2300-01-01'))) td_max
  FROM setup_subtest
  JOIN test_version ON (setup_subtest.subtest_value_id = test_version.subtest_value_id AND setup_subtest.test_id = test_version.test_id)
  JOIN machine ON setup_subtest.machine_id = machine.id
  JOIN facility ON machine.facility_id = facility.id
  JOIN org ON facility.org_id = org.id
  LEFT JOIN test_run ON (test_version.id = test_run.test_version_id AND test_run.machine_id = machine.id)
  WHERE (org.id = :org_id OR facility.id = :facility_id OR machine.id = :machine_id)
  AND enabled = 1
  GROUP BY machine.id, test_version.id
) temp
GROUP BY machine_id, tv_id
