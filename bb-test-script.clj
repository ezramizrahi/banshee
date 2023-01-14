#!/usr/bin/env bb

(ns bb-test-script
  (:require
   [babashka.fs :as fs]
   [babashka.hiccup :as html]
   [cheshire.core :as json]))

(when (fs/exists? "data.json")
  (println "File exists")
  (html [:span {:class "foo"} "bar"])
  (println (json/parse-string (slurp "data.json") true)))
(fs/cwd)