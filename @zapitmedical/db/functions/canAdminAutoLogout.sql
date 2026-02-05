DROP FUNCTION IF EXISTS canAdminAutoLogout;
DELIMITER $$
CREATE FUNCTION canAdminAutoLogout(in_user_id INT(11), in_org_id INT(11)) RETURNS BOOLEAN
  DETERMINISTIC
BEGIN
  DECLARE tf BOOLEAN;

  SELECT IF(org_permission_group.name = 'Super Users',1,org_admin_manage_auto_logout)
  FROM facility
  JOIN facility_user ON facility.id = facility_user.facility_id
  JOIN org_permission_group ON facility_user.group_id = org_permission_group.id
  WHERE org_permission_group.org_id = in_org_id AND facility_user.user_id = in_user_id AND org_admin_manage_auto_logout = 1
  LIMIT 1
  INTO tf;

  RETURN (IFNULL(tf,0));
END $$
DELIMITER ;
