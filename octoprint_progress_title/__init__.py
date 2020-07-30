# coding=utf-8
import octoprint.plugin
from octoprint.events import Events


class ProgressTitlePlugin(octoprint.plugin.ProgressPlugin, octoprint.plugin.AssetPlugin, octoprint.plugin.EventHandlerPlugin):

    def get_assets(self):
        return dict(js=["js/progress_title.js"])

    def on_event(self, event, payload):
        if event == Events.CLIENT_OPENED:
            if self._printer.is_printing():
                printer_data = self._printer.get_current_data()
                progress = int(printer_data['progress']['completion'])
                self._plugin_manager.send_plugin_message(self._identifier, dict(type='update_progress', progress=progress))
            else:
                self._plugin_manager.send_plugin_message(self._identifier, dict(type='remove_progress'))

    def on_print_progress(self, storage, path, progress):
        self._plugin_manager.send_plugin_message(self._identifier, dict(type='update_progress', progress=progress))

    def get_version(self):
        return self._plugin_version

    def get_update_information(self):
        return dict(
            progress_title=dict(
                displayName="Progress Title",
                displayVersion=self._plugin_version,

                # version check: github repository
                type="github_release",
                user="pwnbus",
                repo="OctoPrint-Progress-Title",
                current=self._plugin_version,

                # update method: pip
                pip="https://github.com/pwnbus/OctoPrint-Progress-Title/archive/{target_version}.zip"
            )
        )


__plugin_name__ = "Progress Title"
__plugin_pythoncompat__ = ">=2.7,<4"


def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = ProgressTitlePlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }
