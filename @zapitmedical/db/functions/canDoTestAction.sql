DROP FUNCTION IF EXISTS canDoTestAction;
DELIMITER $$
CREATE FUNCTION canDoTestAction(in_user_id INT(11), in_facility_id INT(11), in_machine_type CHAR(50), in_frequency CHAR(50), in_action CHAR(50)) RETURNS BOOLEAN
  DETERMINISTIC
BEGIN
  DECLARE tf BOOLEAN;
  SELECT
    IF(org_permission_group.name = 'Super Users',1,
      CASE
        WHEN (in_frequency = 1 OR in_frequency = 'daily') AND in_action = 'perform' AND daily_perform = 1 THEN 1
        WHEN (in_frequency = 1 OR in_frequency = 'daily') AND in_action = 'edit' AND daily_edit = 1 THEN 1
        WHEN (in_frequency = 1 OR in_frequency = 'daily') AND in_action = 'signoff' AND daily_signoff = 1 THEN 1
        WHEN (in_frequency = 1 OR in_frequency = 'daily') AND in_action = 'approve' AND daily_approve = 1 THEN 1

        WHEN (in_frequency = 7 OR in_frequency = 'weekly' OR in_frequency = 14 OR in_frequency = 'biweekly') AND in_action = 'perform' AND weekly_perform = 1 THEN 1
        WHEN (in_frequency = 7 OR in_frequency = 'weekly' OR in_frequency = 14 OR in_frequency = 'biweekly') AND in_action = 'edit' AND weekly_edit = 1 THEN 1
        WHEN (in_frequency = 7 OR in_frequency = 'weekly' OR in_frequency = 14 OR in_frequency = 'biweekly') AND in_action = 'signoff' AND weekly_signoff = 1 THEN 1
        WHEN (in_frequency = 7 OR in_frequency = 'weekly' OR in_frequency = 14 OR in_frequency = 'biweekly') AND in_action = 'approve' AND weekly_approve = 1 THEN 1

        WHEN (in_frequency = 30 OR in_frequency = 'monthly') AND in_action = 'perform' AND monthly_perform = 1 THEN 1
        WHEN (in_frequency = 30 OR in_frequency = 'monthly') AND in_action = 'edit' AND monthly_edit = 1 THEN 1
        WHEN (in_frequency = 30 OR in_frequency = 'monthly') AND in_action = 'signoff' AND monthly_signoff = 1 THEN 1
        WHEN (in_frequency = 30 OR in_frequency = 'monthly') AND in_action = 'approve' AND monthly_approve = 1 THEN 1

        WHEN (in_frequency = 91 OR in_frequency = 'quarterly') AND in_action = 'perform' AND quarterly_perform = 1 THEN 1
        WHEN (in_frequency = 91 OR in_frequency = 'quarterly') AND in_action = 'edit' AND quarterly_edit = 1 THEN 1
        WHEN (in_frequency = 91 OR in_frequency = 'quarterly') AND in_action = 'signoff' AND quarterly_signoff = 1 THEN 1
        WHEN (in_frequency = 91 OR in_frequency = 'quarterly') AND in_action = 'approve' AND quarterly_approve = 1 THEN 1

        WHEN (in_frequency = 365 OR in_frequency = 183 OR in_frequency = 'yearly' OR in_frequency = 'semiannual') AND in_action = 'perform' AND yearly_perform = 1 THEN 1
        WHEN (in_frequency = 365 OR in_frequency = 183 OR in_frequency = 'yearly' OR in_frequency = 'semiannual') AND in_action = 'edit' AND yearly_edit = 1 THEN 1
        WHEN (in_frequency = 365 OR in_frequency = 183 OR in_frequency = 'yearly' OR in_frequency = 'semiannual') AND in_action = 'signoff' AND yearly_signoff = 1 THEN 1
        WHEN (in_frequency = 365 OR in_frequency = 183 OR in_frequency = 'yearly' OR in_frequency = 'semiannual') AND in_action = 'approve' AND yearly_approve = 1 THEN 1

        ELSE 0
      END
    )
  FROM facility
  JOIN facility_user ON facility.id = facility_user.facility_id
  JOIN org_permission_group ON facility_user.group_id = org_permission_group.id
  JOIN facility_user_permission ON facility_user.id = facility_user_permission.facility_user_id
  JOIN machine_type ON machine_type.id = facility_user_permission.machine_type_id
  WHERE
    facility_user.user_id = in_user_id AND
    facility.id = in_facility_id AND
    machine_type.name = in_machine_type
  INTO tf;

  RETURN (IFNULL(tf,0));
END $$
DELIMITER ;
