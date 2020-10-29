import sys
import text_generate

genres=["horror","crime","fantasy","sicfi","superhero"]

def connect(genre=sys.argv[1]):
    text_gen=text_generate.textgen()

    if genre=="horror":
        print(textgen.horror())
    
    if genre=="crime":
        print(textgen.crime())
    
    if genre=="fantasy":
        print(textgen.fantasy())
    
    if genre=="scifi":
        print(textgen.fantasy())
    
    if genre=="romance":
        print(textgen.fantasy())

    if genre=="get-topics":
        print(genres)