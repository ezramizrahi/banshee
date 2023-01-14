#!/usr/bin/env bb

(ns bb-test-script
  (:require
   [babashka.fs :as fs]
   [babashka.curl :as curl]
   [cheshire.core :as json]))

(println "BABASHKA")
(when (fs/exists? "package.json")
  (println "File exists"))
(fs/cwd)