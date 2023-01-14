#!/usr/bin/env bb

(ns bb-test-script
  (:require
   [babashka.fs :as fs]
   [cheshire.core :as json]))

(when (fs/exists? "data.json")
  (println "File exists")
  (println (json/parse-string (slurp "data.json") true)))
(fs/cwd)