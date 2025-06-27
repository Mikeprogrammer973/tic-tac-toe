import { controllers } from "../controllers/index.js";

export function handle_controller(route)
{
    controllers[route]()
}