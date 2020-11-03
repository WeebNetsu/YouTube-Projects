# a = 97, b = 98, c = 99 .... ' ' = 32
# A = 65, B = 66

from math import sqrt

def encryptText(text):
    encrypted = ''
    for char in text:
        temp = ord(char) # convert character (eg. 'a'/'b'/'c') to ascii
        temp = temp ** 2 # ascii value^2
        encrypted += str(temp) + ' '
    
    return encrypted + ' '

def decryptText(text):
    word = ''
    decrypted = ''

    for char in text:
        if char != ' ': # depending on how you seperate your characters, this may change
            word += char 
        else: # chr(ord("a")) = 'a'
            try:
                temp = sqrt(int(word))
                temp = chr(int(temp))
                decrypted += temp
                word = ''
            except ValueError: # incase it tries to decrypt '' (nothing)
                continue # or pass, its up to you
    
    return decrypted

text = encryptText("Goodbye my friend, Jack!")

# writing to the files
enc = open("encrypted.mmxm", "w")
enc.write(text)
enc.close()

dec = open("decrypted.mmxm", "w")
dec.write(decryptText(text))
dec.close()

# "123" -> 123 (these two are not the same!!)