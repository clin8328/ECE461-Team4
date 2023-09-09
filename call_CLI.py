import sys

if __name__ == "__main__":
    url_file = open(sys.argv[1], "r")

    for url in url_file.readlines():
        if not (url.__contains__("npmjs.com/") or url.__contains__("github.com/")):
            print(f"INVALID URL: urls must be from NPM or GitHub.\nThe url [{url}] is invalid.")
            sys.exit(1)

        # TODO: CLI goes here

    sys.exit(0)
