# Changelog


## 2025-05-01
- fixed tests after removing start/end log messages ([586aa52](https://github.com/mjt-engine/observe/commit/586aa52b2664425061883af993603cf5a5c2f202)) by Matt Taylor
- no need for start/end log messages ([e74deec](https://github.com/mjt-engine/observe/commit/e74deec32c31dabe597ac85ff41a330fc5bd9d1f)) by Matt Taylor
- remove deps from build artifacts ([9816ff7](https://github.com/mjt-engine/observe/commit/9816ff7e7c855d11f43d5cbf6f276772a9a20e65)) by Matt Taylor
- updated check scripts ([0eacd50](https://github.com/mjt-engine/observe/commit/0eacd50bb46f30617fb6b44e7d3411ae8684d0b9)) by Matt Taylor
- log watcher added to type ([e436a2f](https://github.com/mjt-engine/observe/commit/e436a2fed3767a030fd500c172ce5f46de1931e2)) by Matt Taylor
- fix logmatch logic on timestamp/extra matching ([017f862](https://github.com/mjt-engine/observe/commit/017f8620aaca26d5b18874c6fec67e83231e2f46)) by Matt Taylor
- allow regex for log matching ([c4c089f](https://github.com/mjt-engine/observe/commit/c4c089fe70d9b2360643376d8a82702df9f399a1)) by Matt Taylor
- multiline regex log matcher ([bffa86d](https://github.com/mjt-engine/observe/commit/bffa86d17ae83153133d28e688418cb6c90b6173)) by Matt Taylor
- quiet errors on bad log regex ([fe62ddf](https://github.com/mjt-engine/observe/commit/fe62ddfe6b515cf4e3b194f1f71ec469a3390541)) by Matt Taylor
- bad regex on log match should not crash agent ([f8c9830](https://github.com/mjt-engine/observe/commit/f8c98307471d27de0b23945adb6b58b0657c914e)) by Matt Taylor
- added ability to update log-matchers ([7b6c9b1](https://github.com/mjt-engine/observe/commit/7b6c9b14046350439fd91a7cf7ad21282fd8eff0)) by Matt Taylor

## 2025-04-25
- better default for gauge value ([4049750](https://github.com/mjt-engine/observe/commit/4049750677f36e672b104b0b2b708e9301059764)) by Matt Taylor
- fix bug in guage ([623c833](https://github.com/mjt-engine/observe/commit/623c833e5c0c01adb60c2f27cea32fb48e34867d)) by Matt Taylor
- export LogEntry type ([5f14280](https://github.com/mjt-engine/observe/commit/5f142805aa0e58fd61c638d92c1bb01ba4f1cf0e)) by Matt Taylor
- export Stats and Timer modules ([a74ab71](https://github.com/mjt-engine/observe/commit/a74ab71a19e74f800d783519dbb03aeab1783e1e)) by Matt Taylor
- added guages and other methods to Observe module/Stats module ([38db958](https://github.com/mjt-engine/observe/commit/38db958629ad5a03c413b79f38b7e155f6f245d9)) by Matt Taylor

## 2025-04-23
- add end of time at span end ([c0f3856](https://github.com/mjt-engine/observe/commit/c0f3856c05a9d6cdb0a272e64187758368356dd1)) by Matt Taylor
- added stats ([ad3f7fd](https://github.com/mjt-engine/observe/commit/ad3f7fd6572a368c0dc1cbc16467068be6959899)) by Matt Taylor
- added log transform ([af4e2f7](https://github.com/mjt-engine/observe/commit/af4e2f7487e765a5a61cad6ec0787da5b8850831)) by Matt Taylor
- more complex log matching ([ec3e7f0](https://github.com/mjt-engine/observe/commit/ec3e7f087eadcefa771eef0ece928bda92338001)) by Matt Taylor
- regex for match language ([c596538](https://github.com/mjt-engine/observe/commit/c5965384156f34464132ea5efc323187dc0347eb)) by Matt Taylor
- better logging matchers with globs ([0fdc40a](https://github.com/mjt-engine/observe/commit/0fdc40ac36699bac1c6bda9bef8f9213d8621246)) by Matt Taylor
- refined ObserveAgent, added timestamps to log and clock to Agent ([a422d61](https://github.com/mjt-engine/observe/commit/a422d61169ea46d38f7811809e675e7c39498171)) by Matt Taylor
- allow empty name for root Observe ([7ccaac7](https://github.com/mjt-engine/observe/commit/7ccaac756e117347193218e0813c2080e8e8e6e6)) by Matt Taylor
- initial commit ([c3f6d1e](https://github.com/mjt-engine/observe/commit/c3f6d1e368d46baf03cd925282de39fa1f0b527b)) by Matt Taylor
