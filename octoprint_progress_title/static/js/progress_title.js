$(function() {
    function ProgressTitleViewModel(viewModels) {
        var self = this;

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
            if (data.type === "update_progress") {
                self.updateProgress(data.progress);
            }
            else {
                self.clearProgress();
            }
        };
        self.updateProgress = function(progress) {
            document.title = self.default_title + " - " + progress + "%";
        };
        self.clearProgress = function() {
            document.title = self.default_title;
        };

    }
    ADDITIONAL_VIEWMODELS.push([ProgressTitleViewModel, [], []]);
});
