import {ConfigService} from "@shared/config";
import {TodoistService} from "./todoist.service"

export {TodoistProjectHookMixin, TodoistTaskHookMixin} from "./todoist.entity.mixins"

export const createTodoistClient = (config: ConfigService): TodoistService => {
  const apiToken = config.get("TODOIST_API_TOKEN");
  return new TodoistService(apiToken);
}
