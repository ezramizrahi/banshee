#!/usr/bin/env bb

(ns bb-test-script
  (:require
   [babashka.fs :as fs]
   [babashka.curl :as curl]
   [hiccup.core :as hiccup]
   [cheshire.core :as json]))

;; (when (fs/exists? "data.json")
;;   (println "File exists"))
  ;; (println (hiccup/html [:span {:class "foo"} "bar"]))
  ;; (def movies (map #(:movie %) (json/parse-string (slurp "data.json"))))
  ;; (println movies)
  ;; (spit "textfile.txt" (interpose "\n" movies))
  ;; (println (json/parse-string (slurp "data.json") true)))
(def resp (curl/get "https://banshee.netlify.app/.netlify/functions/get_movies"))
(println (json/parse-string (:body resp))) ;;=> {"code" 200, "description" "OK"}