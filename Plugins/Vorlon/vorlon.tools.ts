﻿module VORLON {
    export class Tools {

        public static SetImmediate(func: () => void): void {
            if (window.setImmediate) {
                setImmediate(func);
            } else {
                setTimeout(func, 0);
            }
        }

        public static Hook(rootObject: any, functionToHook: string, hookingFunction: (...optionalParams: any[]) => void): void {
            var previousFunction = rootObject[functionToHook];

            rootObject[functionToHook] = (...optionalParams: any[]) => {
                hookingFunction(optionalParams);
                previousFunction.apply(rootObject, optionalParams);
            }
        }

        public static CreateCookie(name: string, value: string, days: number): void {
            var expires: string;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            } else {
                expires = "";
            }

            document.cookie = name + "=" + value + expires + "; path=/";
        }

        public static ReadCookie(name: string): string {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }

                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return "";
        }

        // from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
        public static CreateGUID(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        public static RemoveEmpties(arr: string[]): number {
            var len = arr.length;
            for (var i = len - 1; i >= 0; i--) {
                if (!arr[i]) {
                    arr.splice(i, 1);
                    len--;
                }
            }
            return len;
        }

        public static AddClass(e: HTMLElement, name: string): HTMLElement {
            if (e.classList) {
                if (name.indexOf(" ") < 0) {
                    e.classList.add(name);
                } else {
                    var namesToAdd = name.split(" ");
                    Tools.RemoveEmpties(namesToAdd);

                    for (var i = 0, len = namesToAdd.length; i < len; i++) {
                        e.classList.add(namesToAdd[i]);
                    }
                }
                return e;
            } else {
                var className = e.className;
                var names = className.split(" ");
                var l = Tools.RemoveEmpties(names);
                var toAdd;

                if (name.indexOf(" ") >= 0) {
                    namesToAdd = name.split(" ");
                    Tools.RemoveEmpties(namesToAdd);
                    for (i = 0; i < l; i++) {
                        var found = namesToAdd.indexOf(names[i]);
                        if (found >= 0) {
                            namesToAdd.splice(found, 1);
                        }
                    }
                    if (namesToAdd.length > 0) {
                        toAdd = namesToAdd.join(" ");
                    }
                } else {
                    var saw = false;
                    for (i = 0; i < l; i++) {
                        if (names[i] === name) {
                            saw = true;
                            break;
                        }
                    }
                    if (!saw) {
                        toAdd = name;
                    }

                }
                if (toAdd) {
                    if (l > 0 && names[0].length > 0) {
                        e.className = className + " " + toAdd;
                    } else {
                        e.className = toAdd;
                    }
                }
                return e;
            }
        }

        public static RemoveClass(e: HTMLElement, name: string): HTMLElement {
            if (e.classList) {
                if (e.classList.length === 0) {
                    return e;
                }
                var namesToRemove = name.split(" ");
                Tools.RemoveEmpties(namesToRemove);

                for (var i = 0, len = namesToRemove.length; i < len; i++) {
                    e.classList.remove(namesToRemove[i]);
                }
                return e;
            } else {
                var original = e.className;

                if (name.indexOf(" ") >= 0) {
                    namesToRemove = name.split(" ");
                    Tools.RemoveEmpties(namesToRemove);
                } else {
                    if (original.indexOf(name) < 0) {
                        return e;
                    }
                    namesToRemove = [name];
                }
                var removed;
                var names = original.split(" ");
                var namesLen = Tools.RemoveEmpties(names);

                for (i = namesLen - 1; i >= 0; i--) {
                    if (namesToRemove.indexOf(names[i]) >= 0) {
                        names.splice(i, 1);
                        removed = true;
                    }
                }

                if (removed) {
                    e.className = names.join(" ");
                }
                return e;
            }
        }
    }
}
