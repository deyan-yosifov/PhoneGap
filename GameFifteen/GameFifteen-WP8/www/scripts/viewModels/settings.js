(function (global) {
    var SettingsViewModel,
        app = global.app = global.app || {},
        gameVM = app.gameService.viewModel;

    SettingsViewModel = kendo.data.ObservableObject.extend({
        img: "",
        imgWidth: 0,
        imgHeight: 0,
        sizePercent: 0.618,
        difficulty: 50,
        showNumbers: true,
        showPicture: false,
        areNumbersWhite: true,
        showBorders: true,
        
        fitToSize: function (screenWidth, screenHeight) {
            var that = this;

            var container = document.getElementById("settings-container");
            container.setAttribute("style",
                "width:" + screenWidth + "px;" +
                "height:" + screenHeight + "px;"
                );

            var imageMaxWidth = screenWidth * that.sizePercent;
            var imageMaxHeight = screenHeight * that.sizePercent;

            var scaleFactor = (imageMaxWidth / that.imgWidth) * that.imgHeight <= imageMaxHeight
            ? (imageMaxWidth / that.imgWidth)
            : (imageMaxHeight / that.imgHeight);

            that.scale(scaleFactor);
        },

        scale: function (scaleFactor) {
            var that = this;

            var imgContainer = document.getElementById("settings-image");
            var h = that.imgHeight * scaleFactor;
            var w = that.imgWidth * scaleFactor;

            imgContainer.setAttribute("style",
                "width:" + w + "px;" +
                "height:" + h + "px;" +
                "background-size:" + w + "px " + h + "px;" +
                "background-image:url('" + that.img + "');"
                );
        },

        onShowPicture: function () {
            var that = this;

            var image = new Image();
            image.src = that.img;

            setTimeout(function () {
                that.imgWidth = image.width;
                that.imgHeight = image.height;

                that.fitToSize(global.innerWidth, global.innerHeight);

                gameVM.setShowPicture({
                    showImg: that.showPicture,
                    src: that.img,
                    width: that.imgWidth,
                    height: that.imgHeight
                });
            }, 1000);
        },

        chooseImageFromGallery: function () {
            var that = this;

            navigator.camera.getPicture(function (imgSrc) {
                that.img = imgSrc;
                if (that.img) {
                    that.set("showPicture", true);
                    that.onShowPicture();
                }
            }, function (err) { }, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            });
        },

        takeImageWithCamera: function () {
            var that = this;

            navigator.device.capture.captureImage(function (files) {
                that.img = files[0].fullPath;
                if (that.img) {
                    that.set("showPicture", true);
                    that.onShowPicture();
                }
            }, function (err) { });
        }
    });

    var settingsVM = new SettingsViewModel();

    settingsVM.bind("set", function (e) { 
        var property = e.field + "";
        var value = e.value;

        if (property == "difficulty") {
            value = parseInt(value);
            var oldValue = settingsVM.get("difficulty");
            if (!isNaN(value) && isFinite(value) && value > 0) {
                if (value != settingsVM.difficulty) {
                    gameVM.setDifficulty(value);
                }
            }
            else {
                navigator.notification.alert(
                "Difficulty must be positive number!", // message
                function () {
                    settingsVM.set("difficulty", oldValue);
                }, // callback
                'Input error!', // title
                'OK' // buttonName
                );
            }
        }
        else if (property == "showNumbers") {
            if (value == settingsVM.showNumbers) {
                e.preventDefault();
                return;
            }

            gameVM.setShowNumbers(value);
        }
        else if (property == "showBorders") {
            if (value == settingsVM.showBorders) {
                e.preventDefault();
                return;
            }

            gameVM.setShowBorders(value);
        }
        else if (property == "areNumbersWhite") {
            if (value == settingsVM.areNumbersWhite) {
                e.preventDefault();
                return;
            }

            gameVM.setAreNumbersWhite(value);
        }
        else if (property == "showPicture") {
            if (value == settingsVM.showPicture) {
                e.preventDefault();
                return;
            }

            if (value && settingsVM.img) {
                settingsVM.onShowPicture();
            }
            else if (!value) {
                gameVM.setShowPicture({
                    show: false,
                    src: settingsVM.img,
                    width: settingsVM.imgWidth,
                    height: settingsVM.imgHeight
                });
            }
        }
    })

    function initSettings() {
        settingsVM.difficulty = gameVM.difficulty;
        settingsVM.showNumbers = gameVM.showNumbers;
        settingsVM.areNumbersWhite = gameVM.areNumbersWhite;
        settingsVM.showBorders = gameVM.showBorders;
        settingsVM.showPicture = gameVM.showPicture;
    };

    app.settingsService = {
        viewModel: settingsVM,
        initSettings: initSettings
    };
})(window);
