import sys
import text_generate

genres=["horror","crime","fantasy","sicfi","superhero"]

def connect(genre):
    text_gen=text_generate.textgen()

    if genre=="horror":
        print(text_gen.horror())

    if genre=="crime":
        print(text_gen.crime())

    if genre=="fantasy":
        print(text_gen.fantasy())

    if genre=="scifi":
        print(text_gen.scifi())

    if genre=="superhero":
        print(text_gen.superhero())

    if genre=="get-topics":
        data = ""
        for i in genres:
            if i == "superhero":
                data += i
            else:
                data += i + "|"
        print(data)

connect(sys.argv[1])
