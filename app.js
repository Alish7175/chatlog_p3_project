const path = require('path')
const express = require('express')
const bp = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const app = express()

//mongodb connection url 
const connectionString = ""