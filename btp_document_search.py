# -*- coding: utf-8 -*-
"""BTP_Document_Search.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1WGnxnL3u1tp5Mz-9LF5_LLLAecirb6eN

# **Document Search**
"""

doc_name = "sample4.pdf"
doc_content = "This is a sample data used for testing purpose"

"""# ***Part 1 : Generating bloom filter, Storing in MySQL, Making transaction to smart contract (By Data Owner)***


"""

# hash functions 
import math

def h1(s, filterSize) :

    hash = 0;
    hash = int(s) % 10000;
    hash = hash % filterSize
        
    return math.floor(hash)

def h2(s, filterSize) :

    hash = 0
    val1 = 0
    val2 = 0
    val1 =int(s) % 10000;
    s = int(s)//10000;
    val2 = int(s) % 10000;

    hash = (val1 + val2) % filterSize
     
    return math.floor(hash)


def h3(s, filterSize) :

    hash = 0
    val1 = 0
    val2 = 0
    val3 = 0
    val1 = int(s) % 10000;
    s = int(s) // 10000;
    val2 = int(s) % 10000;
    s = int(s) // 10000;
    val3 = s;

    hash = (val1 + val2 + val3) % filterSize
     
    return math.floor(hash)

#wordList = doc_content.split()
wordList=["This","sample","data","testing","purpose"]
print(wordList)

import math

n = len(doc_content) - doc_content.count(" ")  # max possible distinct trigrams
prob = 0.1  # desired false positive probability
m = 192  # size of bloom filter
k = 3   # number of hash funtions 

bloom_filter = [0]*m

def get_trigrams(s) :
    n = len(s)
    s = s + s + s;
    res = []
    for i in range(n) :
        res.append(s[i:i+3])

    return res

def calculate_trigram_decimal(trigram) :

    ans = 0
    ans = ord(trigram[0]) + ord(trigram[1]) * 65536 + ord(trigram[2]) * (65536**2)
    return ans

def checkIfPresent(trigram, bloom_filter) :
    
    s = calculate_trigram_decimal(trigram)
    m = len(bloom_filter)
    hash1 = h1(s, m)
    hash2 = h2(s, m)
    hash3 = h3(s, m) 

    if bloom_filter[hash1] == 1 and bloom_filter[hash2] == 1 and bloom_filter[hash3] == 1 :
        return 1
    
    return 0


def generate_bloom_filter(wordList, bloom_filter) :

    m = len(bloom_filter)

    for word in wordList :
        trigramList = get_trigrams(word)

        for trigram in trigramList :

            var = checkIfPresent(trigram, bloom_filter)

            if var == 1 :
              continue

            s = calculate_trigram_decimal(trigram)

            hash1 = h1(s, m)
            hash2 = h2(s, m)
            hash3 = h3(s, m) 

            bloom_filter[hash1] = 1 
            bloom_filter[hash2] = 1
            bloom_filter[hash3] = 1

generate_bloom_filter(wordList, bloom_filter)

import timeit

for j in range(1,11):
  start = timeit.default_timer()
  for i in range(j):
    generate_bloom_filter(wordList, bloom_filter)

  stop = timeit.default_timer()

  print('Time: ', (stop - start) * 100000)

trigramList = get_trigrams('purpose')

for trigram in trigramList :

    s = calculate_trigram_decimal(trigram)

    hash1 = h1(s, m)
    hash2 = h2(s, m)
    hash3 = h3(s, m) 

    print(hash1, hash2, hash3)

# print bloom_filter contents

print("Size of bloom filter :", len(bloom_filter))

indexes = []

print("Contents of bloom filter :")
for i in range(len(bloom_filter)) :
    if bloom_filter[i] == 1:
        indexes.append(i)
    print(str(bloom_filter[i]) + ",", end='')

print('\n', indexes)

!pip install cryptography

# Convert to string in ascii from numeric representation of triplets
def convert(a) :
    l = len(a)
    s = ""
    
    idx = 0
    while idx < l :
        temp = a[idx:idx+3]
        s = s + chr(int(temp))
        idx = idx + 3
        
    return s

# Creating a random salt of length n
import string
import random

def get_random_salt(n) :
  
    salt=""
    for i in range(n):
        salt=salt+random.choice(string.ascii_letters)

    return salt

# Get a random encryption key
from cryptography.fernet import Fernet

def get_random_encryptkey() :

    encrypt_key = Fernet.generate_key()
    # fernet = Fernet(key)
    return encrypt_key

# Take XOR of string a and string b
def XOR1(a, b) :
    res = ""
    i = 0
    j = 0
    
    while (i<len(a) and j<len(b)) :
        
        temp = str(ord(a[i]) ^ ord(b[j])) 
        
        if len(temp) == 1 :
            temp = "00" + temp
        elif len(temp) == 2 :
            temp = "0" + temp
        
        res += temp
        i = i + 1
        j = j + 1
    
    while i<len(a) :
        
        temp = str(ord(a[i])) 
        
        if len(temp) == 1 :
            temp = "00" + temp
        elif len(temp) == 2 :
            temp = "0" + temp
        
        res += temp
        i = i + 1
        
    while j<len(b) :
        
        temp = str(ord(b[j])) 
        
        if len(temp) == 1 :
            temp = "00" + temp
        elif len(temp) == 2 :
            temp = "0" + temp
        
        res += temp
        j = j + 1
        
    return res

pip install mysql-connector-python-rf

# Commented out IPython magic to ensure Python compatibility.
# install, set connection
!apt-get install mysql-server > /dev/null
!service mysql start
!mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'"
!pip -q install PyMySQL
# %load_ext sql
# %config SqlMagic.feedback=False 
# %config SqlMagic.autopandas=True
# %sql mysql+pymysql://root:root@/
# query using %sql or %%sql
df = %sql SELECT Host, User, authentication_string FROM mysql.user
df

import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root"
)

mycursor = mydb.cursor()

mycursor.execute("DROP DATABASE btp")

mycursor.execute("CREATE DATABASE btp")

mycursor.execute("SHOW DATABASES")
for x in mycursor:
  print(x)

import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database='btp'
)

mycursor = mydb.cursor()

mycursor.execute("DROP TABLE Documents")

mycursor.execute("CREATE TABLE Documents ( doc_name VARCHAR(511), doc_content VARCHAR(64535) )")

mycursor.execute("SHOW TABLES")
for x in mycursor:
  print(x)

def store_data(doc_name, doc_content) : 

    # insert data query 
    insert_query = "INSERT INTO Documents (doc_name, doc_content) VALUES (%s, %s)"
   
    encrypt_key = get_random_encryptkey();
    fernet = Fernet(encrypt_key)

    encrypted_name = fernet.encrypt(doc_name.encode('utf-8'))
    salt = get_random_salt(len(encrypted_name))
    encrypted_salt = fernet.encrypt(salt.encode('utf-8'))
    encrypted_name_with_salt = XOR1(str(encrypted_name),salt)

    encrypted_content = fernet.encrypt(doc_content.encode('utf-8'))
    encrypted_content_with_salt = XOR1(str(encrypted_content),salt)

    encrypted_data = (encrypted_name_with_salt, encrypted_content_with_salt)
    mycursor.execute(insert_query, encrypted_data)
    mydb.commit()

    
    print("Document Name : ", doc_name)

    print("Encryption Key :", encrypt_key)

    print("Salt : ", encrypted_salt)
    print("Salt : ", salt)
    
    print("Encryted Document Name : ", encrypted_name)

store_data(doc_name, doc_content)

# print bloom_filter contents

print("Size of bloom filter :", len(bloom_filter))

print("Contents of bloom filter :")
for i in range(len(bloom_filter)) :
    print(str(bloom_filter[i]) + ",", end='')

mycursor.execute("SELECT * from Documents")
for x in mycursor:
  print(x)

"""# **Part 2 : Query Doc Content from MySQL after getting salt from smart contract (By Data User)**"""

# Get from result of store_data 
key1 = b'nI9RTvYMkQCF9cmaw8dxEBt_JmXyWEa-z7GClQ7cF0c='

fernet1=Fernet(key1)
EncDoc_name = "b'gAAAAABicgvcJ_q-B1GMwn5rEW-6q__ghwNfaRDqy7wG38n0rTfiaCP5P1Enrg-OdYDOJn2X1zMQBFEkSKYAcTkgqLna8H9c5g=='"

# Get from Blockchain
encSalt = "b'gAAAAABicgvcWDLEoeF708QnVHHYeTHRdk6-EOfLKcogEvAXrqH2TXvYjbVuW2Jznln95TcvB9yhFgZVAuOlVo5i4WvPexknlKW4pJzHx_zom9FRHbR5wvjVWBB1KH2UwWfif5WIZ1gD-uMHK9QakUSABz9Y0TKA-zoWvVmXN5s6X7_EmCSv9oRUXC-5cC2sFbohXKTsqf_8MhyxzwimkSCprxoSS7qDNw=='"
salt_temp1=encSalt[1:len(encSalt)]
salt = fernet1.decrypt(salt_temp1.encode('utf-8')).decode()


Idd=(XOR1(salt,EncDoc_name), )

query = "SELECT doc_content from Documents where doc_name= %s"
mycursor.execute(query,Idd)
res=""
for x in mycursor:
  res=x
print(res)
Encrypted_res=XOR1(convert(res[0]),salt)

temp=convert(Encrypted_res)
print(temp)
s1=temp[1:len(temp)]
decMessage = fernet1.decrypt(s1.encode('utf-8')).decode()

print("\n\nDecrypted string: ", decMessage)

