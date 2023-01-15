#!/usr/bin/env bb

(ns bb-test-script
  (:require
   [babashka.fs :as fs]
   [babashka.curl :as curl]
   [hiccup.core :as hiccup]
   [cheshire.core :as json]))

(def resp (curl/get "https://banshee.netlify.app/.netlify/functions/get_movies"))
(println "hello")