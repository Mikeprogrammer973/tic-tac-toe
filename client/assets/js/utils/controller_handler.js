import { controllers } from "../controllers/index.js";

export async function handle_controller(route)
{
    await new controllers.Auth().check()
    controllers[route]()
}