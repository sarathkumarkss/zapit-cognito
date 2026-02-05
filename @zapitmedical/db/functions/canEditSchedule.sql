DROP FUNCTION IF EXISTS canEditSchedule;
DELIMITER $$
CREATE FUNCTION canEditSchedule(in_user_id INT(11), in_facility_id INT(11)
-- , in_machine_type CHAR(50)
) RETURNS BOOLEAN
  DETERMINISTIC
BEGIN
  DECLARE tf BOOLEAN;

  SELECT IF(org_permission_group.name = 'Super Users',1,schedule_edit)
  FROM facility
  JOIN facility_user ON facility.id = facility_user.facility_id
  JOIN org_permission_group ON facility_user.group_id = org_permission_group.id
  -- JOIN facility_user_permission ON facility_user.id = facility_user_permission.facility_user_id
  -- JOIN machine_type ON facility_user_permission.machine_type_id = machine_type.id
  WHERE facility.id = in_facility_id AND facility_user.user_id = in_user_id
  -- AND machine_type.name = in_machine_type
  INTO tf;

  RETURN (IFNULL(tf,0));
END $$
DELIMITER ;
