$(function() {
    function ProgressTitleViewModel(parameters) {
        var self = this;
        self.printerStateViewModel = parameters[0];

        self.original_processProgressData = self.printerStateViewModel._processProgressData;
        self.printerStateViewModel._processProgressData = function(data) {
            self.original_processProgressData(data);
            if (data.completion) {
                // Attempt to detect if we should use system print time
                // or if a plugin is running that sets the value
                if (data.printTimeLeftOrigin == 'linear' || data.printTimeLeftOrigin == 'average') {
                    self.custom_time_plugin = false;
                }
                else {
                    self.custom_time_plugin = true;
                }
                if (data.completion) {
                    if (self.custom_time_plugin){
                        // References the PrintTimeGenius plugin
                        percentage_completed = (data.printTime||0) / ((data.printTime||0) + (data.printTimeLeft)) * 100;
                    }
                    else {
                        percentage_completed = data.completion;
                    }
                    self.updateProgress(parseInt(percentage_completed));
                }
                else {
                    self.clearProgress();
                }
            }
            else {
                self.clearProgress();
            }
        };

        self.onAllBound = function () {
            self.default_title = document.title;
        };

        self.onDataUpdaterPluginMessage = function (plugin, data) {
            if (plugin != "progress_title") {
                return;
            }
            self._handle_message(data);
        };

        self.onEventPrinterStateChanged = function(data) {
            self._handle_message(data);
        };

        self._handle_message = function(data){
            if (!data.hasOwnProperty("type")) {
                self.clearProgress();
                return;
            }
            if (self.custom_time_plugin == false) {
                // Use normal system progress
                if (data.type === "update_progress") {
                    self.updateProgress(data.progress);
                }
                else {
                    self.clearProgress();
                }
            }
        };
        self.updateProgress = function(progress) {
            document.title = self.default_title + " - " + progress + "%";
        };
        self.clearProgress = function() {
            document.title = self.default_title;
        };
    }
    OCTOPRINT_VIEWMODELS.push({
        construct: ProgressTitleViewModel,
        dependencies: ["printerStateViewModel"]
    });
});
