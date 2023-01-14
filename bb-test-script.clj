#!/usr/bin/env bb

(ns bb-test-script.core
  (:require [clojure.string :as str]
            [clojure.java.shell :as shell]
            [clojure.tools.cli :as tools.cli]))

(println "BABASHKA")
(prn *file*)