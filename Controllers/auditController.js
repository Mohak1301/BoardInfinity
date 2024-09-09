import AuditLog from '../Models/auditlogModel.js';
import { Project, User, ProjectUser } from '../Models/associations.js'; 


export const getAuditLogsController = async (req, res) => {
    try {
      if (req.user.roleId !== 'Admin') {
        return res.status(403).send({
          success: false,
          message: 'Access Denied: Only Admins can view audit logs',
        });
      }
  
      const auditLogs = await AuditLog.findAll({
        include: [
          {
            model: User,
            as: 'performer',
            attributes: ['id', 'name', 'email'],
        
          },
        ],
        
        order: [['performedAt', 'DESC']],
      });
  
      console.log(auditLogs)
      res.status(200).send({
        success: true,
        message: 'Audit logs retrieved successfully',
        auditLogs,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: 'Error while retrieving audit logs',
        error,
      });
    }
  };
  