#!/usr/bin/env bb

(ns bb-test-script
  (:require
   [babashka.fs :as fs]
   [hiccup.core :as hiccup]
   [cheshire.core :as json]))

(when (fs/exists? "data.json")
  (println "File exists")
  (hiccup/html [:span {:class "foo"} "bar"])
  (println (json/parse-string (slurp "data.json") true)))
(fs/cwd)