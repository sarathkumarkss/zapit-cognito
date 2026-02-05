DROP FUNCTION IF EXISTS canAdminUsers;
DELIMITER $$
CREATE FUNCTION canAdminUsers(in_user_id INT(11), in_facility_id INT(11), in_org_id INT(11)) RETURNS BOOLEAN
  DETERMINISTIC
BEGIN
  DECLARE tf BOOLEAN;

  IF in_facility_id IS NOT NULL
  THEN
    SELECT IF(org_permission_group.name = 'Super Users',1,admin_assign_users)
    FROM facility
    JOIN facility_user ON facility.id = facility_user.facility_id
    JOIN org_permission_group ON facility_user.group_id = org_permission_group.id
    WHERE facility.id = in_facility_id AND facility_user.user_id = in_user_id
    INTO tf;
  ELSEIF in_org_id IS NOT NULL
  THEN
    SELECT IF(COUNT(*) > 0,1,0)
    FROM facility
    JOIN org ON facility.org_id = org.id
    JOIN facility_user ON facility.id = facility_user.facility_id
    JOIN org_permission_group ON facility_user.group_id = org_permission_group.id
    WHERE org.id = in_org_id AND
      facility_user.user_id = in_user_id AND
      (admin_assign_users = 1 OR org_permission_group.name = 'Super Users')
    INTO tf;
  END IF;

  RETURN (IFNULL(tf,0));
END $$
DELIMITER ;
