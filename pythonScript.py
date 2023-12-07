import sys

def transform_input(input_string):
    # Extract name from input string
    start_index = input_string.find('<') + 1
    end_index = input_string.find('>', start_index)
    name = input_string[start_index:end_index]

    # Transform input
    transformed_output = f'\n String Len: {len(name)}'
    return transformed_output

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: python pythonScript.py "<input_string>"')
        sys.exit(1)

    input_string = sys.argv[1]
    result = transform_input(input_string)
    print(result)
