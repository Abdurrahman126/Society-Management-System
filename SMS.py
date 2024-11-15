from flask import Flask, render_template, redirect, request, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql
from pymysql.cursors import DictCursor
app = Flask(__name__)
app.config['SECRET_KEY'] = 'k224150'
app.config['TEMPLATES_AUTO_RELOAD'] = True

def get_connection():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='newuser',
            password='@Akhan25',
            database='Society_Management_System',
            cursorclass=DictCursor 
        )
        print("Connection successful!")
        return connection
    except pymysql.MySQLError as err:
        print(f"Error connecting to the database: {err}")
        return None
