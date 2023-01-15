#!/usr/bin/env bb

(ns bb-test-script
  (:require
   [babashka.fs :as fs]
   [babashka.curl :as curl]
   [hiccup.core :as hiccup]
   [cheshire.core :as json]))

(def project-root (-> *file* babashka.fs/parent babashka.fs/parent))

;; Print root folder
(println (str project-root))