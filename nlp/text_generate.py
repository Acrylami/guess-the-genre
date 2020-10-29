from textgenrnn import textgenrnn

class textgen():
    
    def superhero(self):
        textgen = textgenrnn('checkpoints/superhero_weights.hdf5')
        return textgen.generate(max_gen_length=1500, return_as_list=True, temperature=1.0)
    
    def crime(self):
        textgen = textgenrnn('checkpoints/crime_weights.hdf5')
        return textgen.generate(max_gen_length=1500, return_as_list=True, temperature=1.0)
    
    def fantasy(self):
        textgen = textgenrnn('checkpoints/fantasy_weights.hdf5')
        return textgen.generate(max_gen_length=1500, return_as_list=True, temperature=1.0)

    def horror(self):
        textgen = textgenrnn('checkpoints/horror_weights.hdf5')
        return textgen.generate(max_gen_length=1500, return_as_list=True, temperature=1.0)
    
    def scifi(self):
        textgen = textgenrnn('checkpoints/scifi_weights.hdf5')
        return textgen.generate(max_gen_length=1500, return_as_list=True, temperature=1.0)