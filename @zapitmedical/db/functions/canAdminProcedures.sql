DROP FUNCTION IF EXISTS canAdminProcedures;
DELIMITER $$
CREATE FUNCTION canAdminProcedures(in_user_id INT(11), in_org_id INT(11)
-- , in_machine_type CHAR(50)
) RETURNS BOOLEAN
  DETERMINISTIC
BEGIN
  DECLARE tf BOOLEAN;

  SELECT IF(COUNT(*) > 0,1,0)
  FROM facility
  JOIN facility_user ON facility.id = facility_user.facility_id
  -- JOIN facility_user_permission ON facility_user.id = facility_user_permission.facility_user_id
  -- JOIN machine_type ON facility_user_permission.machine_type_id = machine_type.id
  JOIN org_permission_group ON facility_user.group_id = org_permission_group.id
  WHERE facility_user.user_id = in_user_id AND org_permission_group.org_id = in_org_id
  AND (admin_edit_procedures = 1 OR org_permission_group.name = 'Super Users')
  -- AND machine_type.name = in_machine_type
  INTO tf;

  RETURN (IFNULL(tf,0));
END $$
DELIMITER ;
