(function() {
    function addZero(x) {
        return x < 10 ? '0' + x : x;
    }

    var clockloop = window.setInterval(function() {
        var canvas  = document.getElementById("clockarea");
        var painter = canvas.getContext("2d");
        painter.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制表盘
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        var radius = 150;
        painter.beginPath();
        painter.arc(x, y, radius, 0, 2 * Math.PI, false);
        painter.closePath();
        painter.lineWidth= 8;
        painter.strokeStyle = 'blue';
        painter.stroke();

        // 绘制刻度
        painter.beginPath();
        painter.strokeStyle = 'black';
        for (var i = 0; i < 12; i++) {
            var angle = i / 12 * Math.PI*2;
            painter.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
            painter.lineTo(x + (radius - 20) * Math.cos(angle), y + (radius - 20) * Math.sin(angle));
        };
        painter.closePath();
        painter.stroke();

        // 绘制三个针

        // 定义三个针的长度
        var lenHour = 80;
        var lenMinute = 100;
        var lenSecond = 120;

        // 获取时间
        var thisTime = new Date();
        var hour     = thisTime.getHours();
        var minute   = thisTime.getMinutes();
        var second   = thisTime.getSeconds();

        // 计算角度
        var angleHour = (((hour%12)*3600 + minute*60 + second) / (12*3600.0)) * Math.PI * 2 - Math.PI / 2;
        var angleMinute = (minute*60 + second) / 3600 * Math.PI*2 - Math.PI / 2;
        var angleSecond = second / 60 * Math.PI * 2 - Math.PI / 2;

        // 绘制针
        painter.beginPath();
        painter.strokeStyle = 'black';
        painter.moveTo(x, y);
        painter.lineTo(x + lenHour*Math.cos(angleHour), y + lenHour*Math.sin(angleHour));
        painter.closePath();
        painter.stroke();
        painter.beginPath();
        painter.strokeStyle = 'green';
        painter.lineWidth = 5;
        painter.moveTo(x, y);
        painter.lineTo(x + lenMinute*Math.cos(angleMinute), y + lenMinute*Math.sin(angleMinute));
        painter.closePath();
        painter.stroke();
        painter.beginPath();
        painter.strokeStyle = 'red';
        painter.lineWidth = 2;
        painter.moveTo(x, y);
        painter.lineTo(x + lenSecond*Math.cos(angleSecond), y + lenSecond*Math.sin(angleSecond));
        painter.closePath();
        painter.stroke();

        // 输出时间
        painter.font = 'bold 30px Microsoft YaHei';
        painter.fillText(addZero(hour) + ':' + addZero(minute) + ':' + addZero(second), 110, 350, 130);
    }, 100);

    var clockapp = angular.module('clock', []);
    var clocks = [];

    clockapp.controller('clockapp', function($scope) {
        $scope.ringing = -1;
        $scope.count = 0;
        $scope.toDo = 'addNewClock';
        $scope.clocks = [];

        $scope.showdialog = false;

        $scope.addZero = function(x) {
            return x < 10 ? '0' + x : x;
        }

        $scope.addNewClockClick = function() {
            $scope.showdialog = true;
            $scope.toDo = 'addNewClock';
            $scope.toEdit = '';
        }

        $scope.removeClock = function(clock) {
            for (var i = 0; i < $scope.clocks.length; i++) {
                if ($scope.clocks[i].clockId == clock) {
                    $scope.clocks.splice(i,1);
                    return ;
                };
            };
        }

        $scope.editClockClick = function(clock) {
            $scope.toEdit = clock;
            $scope.toDo = 'editClock';
            $scope.showdialog = true;
        }

        $scope.editClock = function(clock, h, m) {
            for (var i = 0; i < $scope.clocks.length; i++) {
                if ($scope.clocks[i].clockId == clock) {
                    $scope.clocks[i]['time_h'] = h;
                    $scope.clocks[i]['time_m'] = m;
                };
            };
        }

        $scope.submitClick = function() {
            var h = document.getElementById("hour").value;
            var m = document.getElementById("minute").value;
            console.log(h);
            switch ($scope.toDo) {
                case 'addNewClock':{
                    clockId = $scope.count;
                    var temp = new Object();
                    temp = {
                        'clockId' : clockId,
                        'time_h'  : parseInt(h),
                        'time_m'  : parseInt(m)
                    }
                    $scope.clocks.push(temp);
                    $scope.count += 1;
                    console.log($scope.clocks);
                    break;
                }
                case 'editClock':{
                    clockId = $scope.toEdit;
                    $scope.editClock(clockId, h, m);
                    break;
                }
            }
            $scope.showdialog = false;
            document.getElementById("hour").value = '';
            document.getElementById("minute").value = '';
        }

        $scope.stopPlay = function() {
            p = document.getElementById("ringsound");
            p.pause();
            p.currentTime = 0;
        }

        $scope.shouldRing = function() {
            var t = new Date();
            var hrs = t.getHours();
            var min = t.getMinutes();
            for (var i = 0; i < $scope.clocks.length; i++) {
                if ($scope.clocks[i].time_h == hrs && $scope.clocks[i].time_m == min) {
                    return i;
                };
            };
            return -1;
        }

        var k = setInterval(function() {
            var toRing = $scope.shouldRing();
            if (toRing >= 0) {
                p = document.getElementById("ringsound");
                if ($scope.ringing != toRing) {
                    $scope.ringing = toRing;
                    p.play();
                };
            } else {
                $scope.ringing = -1;
            };
        }, 100);
    });
})();
