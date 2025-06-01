import type { Request, Response , NextFunction} from "express";
import { createRole, getAllRoles } from "../services/roleService";
import { createRoleSchema } from "../validators/roleValidate";

const handleCreateRole = async (req: Request) => {
  const body = req.body;
  const { error } = createRoleSchema.validate(body);
  if (error) {
    return {
      status: false,
      message: error.message

    };
  }

  try {
    const role = await createRole(body.name);
    return {
      status: true,
      content: { data: role },
      statusCode: 200
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message || "Something went wrong",
      statusCode: 500
    };
  }
};

const handleGetAllRoles = async () => {
  try {
    const roles = await getAllRoles();
    const data = roles;

    return {
      status: true,
      content: {
        meta: {
          total: data.length,
           pages: 1,
           page: 1
         },
        data: data
      },
      statusCode: 200
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.message || "Something went wrong",
      statusCode: 500
    };
  }
};

export { handleCreateRole, handleGetAllRoles };
