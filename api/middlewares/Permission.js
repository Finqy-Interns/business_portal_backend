const asyncHandler = require('express-async-handler');

// Models Improt 
const Role = require('../../db/models/Role')
const RolePermission = require('../../db/models/RolePermission');
const Permission = require('../../db/models/Permission');

module.exports = function (permissionAlloted) {
	return asyncHandler(async function (req, res, next) {
		try {
			
			if (!req.user?.username){
                return res.status(400).json({
                    msg:"No User Found",
                    status:400,
                })
            }

            const { role } = req.user;

            const roleRecord = await Role.findOne({
                where: {
                    name: role
                },
                attributes: ['role_id']
            });

            const id = roleRecord.dataValues.role_id;

            const rolePermissionRecord = await RolePermission.findAll({
                where:{
                    role_id:id
                },
                include: [
                    Permission
                ]
            })

            const permissionsAllowed = rolePermissionRecord.map(rp=>rp.dataValues['Permission'].dataValues.name)
            // name => rolePermissions.includes(name)
            if(permissionsAllowed.some(permission => permissionAlloted.includes(permission))){
                return next();
            }
            else{
                return res.status(401).json({
                    msg:"Not Authorized. Please Tell Admin to add permissions for you",
                    status:401
                })
            }
			// return next();
		}
		catch (err) {
			console.error(err);
			return res.status(err.status || 500).json(err);
		}
	});
}