SELECT
  CONCAT(m.id,'_',test.id) id,
  m.id machine_id,
  machine_test_setup.id setup_id,
  machine_test_setup.id setup_id_2,
  org.id org_id,
  org.id org_id_2,
  org.name org_name,
  facility.id facility_id,
  facility.name facility_name,
  m.name machine_name,
  machine_type.name machine_type,
  m.active machine_active,
  test.id test_id,
  tv.id test_version_id,
  test.name test_name,
  test_run.max_test_date,
  test_run.min_of_all_maxes,
  test_run.days_since_last_run,
  subtest_count.subtests,
  subtests_enabled.enabled subtests_enabled,
  machine_test_setup.frequency,
  m.machine_type_id machine_type_id,

  -- partial
  IF(DATEDIFF(DATE(test_run.max_test_date), DATE(test_run.min_of_all_maxes)) >= machine_test_setup.frequency,1,0)  partial,


  -- is this a "mytest"
  IF(:special_user = 1,1,(
    SELECT IF(COUNT(*) > 0,1,0) FROM facility_user
    JOIN org_permission_group ON group_id = org_permission_group.id
    WHERE (
      user_id = :user_id
      AND org_permission_group.org_id = org_id_2
      AND facility_user.facility_id = m.facility_id
      AND
      (
        org_permission_group.name = 'Super Users' OR (
          IF(machine_test_setup.frequency = 1,org_permission_group.daily_perform,
          IF(machine_test_setup.frequency = 7,org_permission_group.weekly_perform,
          IF(machine_test_setup.frequency = 14,org_permission_group.weekly_perform,
          IF(machine_test_setup.frequency = 30,org_permission_group.monthly_perform,
          IF(machine_test_setup.frequency = 91,org_permission_group.quarterly_perform,
          IF(machine_test_setup.frequency = 183,org_permission_group.quarterly_perform,
          IF(machine_test_setup.frequency = 365,org_permission_group.yearly_perform,
          IF(machine_test_setup.frequency = 730,org_permission_group.yearly_perform,FALSE
          ))))))))
        )
      )
    ))
  ) mytests,

  -- date test is due
  IFNULL(
    CONVERT_TZ( DATE(ADDDATE(test_run.max_test_date,machine_test_setup.frequency)), 'America/New_York', 'UTC'),
    CONVERT_TZ( machine_test_setup.start_date, 'America/New_York', 'UTC')
  ) due_at,

  -- is this test timely
  -- America/New_York
  IFNULL(
    IF ( CONVERT_TZ( DATE(ADDDATE(
      -- if it's a subtest, use "min_of_all_maxes" (what if one subtest was run 2 days before others...)
      IF(subtest_count.subtests IS NULL,test_run.max_test_date,test_run.min_of_all_maxes)
    ,machine_test_setup.frequency)), 'America/New_York', 'UTC') > FROM_UNIXTIME(:now), 0, 1),

    IF ( CONVERT_TZ( machine_test_setup.start_date, 'America/New_York', 'UTC') > FROM_UNIXTIME(:now), 1, 0)
  ) AS is_timely,

  -- count of test runs pending approval
  (
    SELECT COUNT(*)
    FROM test_run tr
    JOIN test_version ON tr.test_version_id = test_version.id
    WHERE (tr.test_version_id = tv.id OR test_version.parent_id = tv.id)
    AND tr.machine_id = m.id
    AND (approve_user_id IS NULL OR approve_user_id = 0)
    AND exclude = 0
    AND setup_id != 0
    AND status != 'not_run'
  ) AS pending_approve,
  machine_test_setup.num_ready_groups,
  machine_test_setup.num_ready_items,
  machine_test_setup.setup_matches,


  IF(machine_test_setup.start_date IS NULL OR machine_test_setup.start_date = '0000-00-00 00:00:00','Start date is not set',
  IF(machine_test_setup.procedure_id IS NULL,'Procedure is not set',
  IF(machine_test_setup.frequency IS NULL,'Frequency is not set',
  IF(subtest_count.subtests > 0 AND (subtests_enabled.enabled = 0 OR subtests_enabled.enabled IS NULL),'No subtests have been enabled for this test',

  -- output constancy - needs electrometers/chambers
  IF((
    (test.name = 'output_constancy_monthly' OR test.name = 'output_constancy_other' OR test.name = 'tg51')
      AND (
    (SELECT COUNT(*) FROM machine JOIN machine_type ON machine.machine_type_id = machine_type.id WHERE facility_id = m.facility_id AND machine_type.name = 'electrometer' AND machine.active = 1) = 0 OR
    (SELECT COUNT(*) FROM machine JOIN machine_type ON machine.machine_type_id = machine_type.id WHERE facility_id = m.facility_id AND machine_type.name = 'ion_chamber' AND machine.active = 1) = 0
  )),'Facility needs at least one chamber and electrometer',

  -- output constancy - needs tg51
  IF(test.name = 'output_constancy_monthly' AND missing_tg51_runs.cnt > 0,
    'TG51 test runs missing',

  -- transmit gain
  IF(test.name = 'transmit_gain_attenuation' AND
    (SELECT COUNT(*) FROM machine_test_setup_field mtsf2 JOIN test_field ON mtsf2.test_field_id = test_field.id WHERE mtsf2.setup_id = setup_id_2 AND test_field.name = 'baseline' AND (mtsf2.val = '' OR mtsf2.val IS NULL)) > 0,
    'Baseline must be set',

  IF(test.name = 'transmit_gain_attenuation' AND
    (SELECT COUNT(*) FROM machine_test_setup_field mtsf2 JOIN test_field ON mtsf2.test_field_id = test_field.id WHERE mtsf2.setup_id = setup_id_2 AND test_field.name = 'mode' AND mtsf2.val = 'tolerance_range') > 0 AND
    (SELECT COUNT(*) FROM machine_test_setup_field mtsf2 JOIN test_field ON mtsf2.test_field_id = test_field.id WHERE mtsf2.setup_id = setup_id_2 AND test_field.name = 'pass_fail_criteria' AND (mtsf2.val = '' OR mtsf2.val IS NULL)) > 0,
    'Pass/fail criteria is required in "Tolerance Range" mode',


  -- center frequency
  IF(
    test.name = 'center_frequency' AND
    (SELECT COUNT(*) FROM machine_test_setup_field mtsf2 JOIN test_field ON mtsf2.test_field_id = test_field.id WHERE mtsf2.setup_id = setup_id_2 AND test_field.name = 'mode' AND mtsf2.val = 'tolerance_range') = 1 AND
    (
      SELECT COUNT(*)
      FROM machine_test_setup_field mtsf2
      JOIN test_field ON mtsf2.test_field_id = test_field.id
      WHERE
        mtsf2.setup_id = setup_id_2 AND
        (test_field.name = 'baseline' OR test_field.name = 'pass_fail_criteria' OR test_field.name = 'previous_value_pass_fail_criteria') AND
        test_field.test_version_id = tv.id AND
        mtsf2.val != ''
    ) != 3,
    'Fields missing for center frequency',

  -- required fields
  IF(machine_test_setup.op = 'or' AND machine_test_setup.setup_matches = 0,'One or more setup fields are missing',
    IF(machine_test_setup.op = 'and' AND machine_test_setup.num_ready_items < machine_test_setup.setup_matches,'One or more setup fields are missing',

  'ready'))))))))))) AS status,
  machine_test_setup.start_date,
  IFNULL(machine_test_setup.frequency,1) AS frequency,
  IF(machine_test_setup.alias IS NULL OR machine_test_setup.alias = '',tv.label,machine_test_setup.alias) AS label,
  -- IFNULL(machine_test_setup.alias,tv.label) AS label,
  IFNULL(machine_test_order.ordinal,9999) AS orderby



FROM machine m
JOIN machine_type ON m.machine_type_id = machine_type.id
JOIN facility ON m.facility_id = facility.id

-- user permission stuff
LEFT JOIN facility_user ON facility_user.user_id = :user_id AND facility_user.facility_id = facility.id
LEFT JOIN facility_user_permission ON facility_user_permission.facility_user_id = facility_user.id AND facility_user_permission.machine_type_id = machine_type.id

JOIN org ON facility.org_id = org.id
JOIN test ON m.machine_type_id = test.machine_type_id
JOIN test_version tv ON test.id = tv.test_id
LEFT JOIN machine_test_order ON m.id = machine_test_order.machine_id AND test.id = machine_test_order.test_id
LEFT JOIN subtest_value ON tv.subtest_value_id = subtest_value.id
LEFT JOIN (
  SELECT mts1.id,
    mts1.frequency,
    mts1.start_date,
    mts1.procedure_id,
    mts1.alias,
    mts1.machine_id,
    mts1.test_version_id,
    COUNT(DISTINCT trg.id) num_ready_groups,
    COUNT(tri.id) num_ready_items,
    COUNT(mtsf.id) setup_matches,
    trg.op
  FROM machine_test_setup mts1
  LEFT JOIN test_ready_group trg ON mts1.test_version_id = trg.test_version_id
  LEFT JOIN test_ready_item tri ON trg.id = tri.test_ready_group_id
  LEFT JOIN machine_test_setup_field mtsf ON (
    tri.test_field_id = mtsf.test_field_id AND
    mtsf.setup_id = mts1.id AND
    tri.val = mtsf.val
  )
  JOIN machine ON mts1.machine_id = machine.id
  JOIN facility ON machine.facility_id = facility.id
  JOIN org ON facility.org_id = org.id

  WHERE mts1.created_at = (
    SELECT MAX(created_at) FROM machine_test_setup mts2 WHERE mts1.machine_id = mts2.machine_id AND mts1.test_version_id = mts2.test_version_id
  ) AND (org.id = :org_id OR facility.id = :facility_id OR machine.id = :machine_id)
  GROUP BY mts1.machine_id, mts1.test_version_id
) machine_test_setup ON m.id = machine_test_setup.machine_id AND tv.id = machine_test_setup.test_version_id

-- join to most recent test run
LEFT JOIN (
  SELECT
    tr.id,
    tr.machine_id,
    IFNULL(tv.parent_id,tr.test_version_id) test_version_id,

    CONVERT_TZ(
      IF(tv.parent_id IS NULL, MAX(test_date),
      (
        SELECT IF(MAX(test_date_list.td) = '2300-01-01 00:00:00',NULL,MAX(test_date_list.td))
        FROM
        (
          SELECT temp.machine_id, temp.parent_id, MAX(temp.td) td
          FROM (
            SELECT
              machine.id machine_id,
              test_version.id test_version_id,
              test_version.parent_id,

              -- handles subtest not being run
              MAX(IFNULL(test_date,DATE('2300-01-01'))) td
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
          GROUP BY machine_id, parent_id
        ) test_date_list
        WHERE test_date_list.parent_id = tv.parent_id AND test_date_list.machine_id = tr.machine_id
        ORDER BY test_date_list.td
      )
    ),
      'UTC','America/New_York'
    ) AS max_test_date,

    DATEDIFF(FROM_UNIXTIME(:now),MAX(test_date)) AS days_since_last_run,

    CONVERT_TZ(
      IF(tv.parent_id IS NULL, NULL,
      (
        SELECT MIN(test_date_list.td)
        FROM
        (
          SELECT temp.machine_id, temp.parent_id, MIN(temp.td) td
          FROM (
            SELECT
              machine.id machine_id,
              test_version.id test_version_id,
              test_version.parent_id,

              -- handles subtest not being run
              MAX(IFNULL(test_date,DATE('2000-01-01'))) td
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
          GROUP BY machine_id, parent_id
        ) test_date_list
        WHERE test_date_list.parent_id = tv.parent_id AND test_date_list.machine_id = tr.machine_id
        ORDER BY test_date_list.td
      )
    ),
      'UTC','America/New_York'
    ) AS min_of_all_maxes

  FROM test_run tr
  JOIN test_version tv ON tr.test_version_id = tv.id
  JOIN machine ON tr.machine_id = machine.id
  JOIN facility ON machine.facility_id = facility.id
  JOIN org ON facility.org_id = org.id
  WHERE exclude = 0 AND (org.id = :org_id OR facility.id = :facility_id OR machine.id = :machine_id)
  GROUP BY machine_id, IFNULL(tv.parent_id,tr.test_version_id)
) test_run ON m.id = test_run.machine_id AND tv.id = test_run.test_version_id

-- does this test have subtests?
LEFT JOIN (
  (
    SELECT tv1.id tv1id, COUNT(tv2.id) subtests
    FROM test_version tv1
    JOIN test_version tv2
    ON tv1.id = tv2.parent_id
    GROUP BY tv1.id
  )
) subtest_count ON tv1id = tv.id

-- how many enabled
-- how many enabled
LEFT JOIN (
  SELECT setup_subtest.machine_id,test_version.parent_id, COUNT(DISTINCT setup_subtest.id) enabled
  FROM setup_subtest
  JOIN subtest_value ON setup_subtest.subtest_value_id = subtest_value.id
  JOIN test_version ON test_version.subtest_value_id = subtest_value.id AND setup_subtest.test_id = test_version.test_id
  JOIN machine ON setup_subtest.machine_id = machine.id
  JOIN facility ON machine.facility_id = facility.id
  JOIN org ON facility.org_id = org.id
  WHERE enabled = true AND (org.id = :org_id OR facility.id = :facility_id OR machine.id = :machine_id)
  GROUP BY machine_id,parent_id
) subtests_enabled ON (subtests_enabled.machine_id = machine_test_setup.machine_id AND subtests_enabled.parent_id = tv.id)

-- missing tg51 runs
LEFT JOIN (
  SELECT t1.org_id,t1.facility_id,t1.machine_id,COUNT(*) cnt FROM
    (
      SELECT DISTINCT org_id, facility_id, machine.id machine_id, test_version.name name
      FROM setup_subtest
      JOIN test ON setup_subtest.test_id = test.id
      JOIN subtest_value ON setup_subtest.subtest_value_id = subtest_value.id
      JOIN test_version ON test_version.subtest_value_id = subtest_value.id
      JOIN machine ON setup_subtest.machine_id = machine.id
      JOIN facility ON machine.facility_id = facility.id
      JOIN org ON facility.org_id = org.id
      WHERE setup_subtest.enabled = 1 AND test.name = 'output_constancy_monthly'
      ORDER BY test_version.name
    ) t1

    LEFT JOIN

    (
      SELECT DISTINCT test_run.machine_id, test_version.name name
      FROM test_run
      JOIN test_version ON test_run.test_version_id = test_version.id
      JOIN test ON test_version.test_id = test.id
      WHERE test.name = 'tg51'
      ORDER BY test_version.name
    ) t2

    ON t1.name = t2.name AND t1.machine_id = t2.machine_id
    WHERE t2.name IS NULL
    GROUP BY machine_id
) missing_tg51_runs ON missing_tg51_runs.machine_id = m.id

WHERE tv.parent_id IS NULL
AND ((org.id = :org_id OR facility.id = :facility_id OR m.id = :machine_id)  OR :all_machines = 1)
AND IF(:special_user = 1,1 = 1,facility_user_permission.id IS NOT NULL)
AND IF(:machine_type_id,m.machine_type_id = :machine_type_id,1 = 1)
AND m.deleted_at IS NULL
GROUP BY m.id, tv.id
ORDER BY m.name ASC, frequency ASC, orderby ASC;
