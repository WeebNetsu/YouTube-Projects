from bs4 import BeautifulSoup
import requests

class ItchScraper():
    def __init__(self, platform="all", tag=None):
        self.platform = platform
        self.tag = tag
        self.LINK = "https://itch.io/games/free"
        self.PLATFORMS = ("osx", "linux", "windows", "android", "ios", "web", "all")
    
    def set_platform(self, platform: str) -> None:
        """
        Platform can be one of the following:
        osx, linux, windows, android, ios, web, all
        """

        try:
            if platform.lower().strip() in self.PLATFORMS:  
                self.platform = platform.lower().strip()
        except Exception as e:
            print(f"ERROR: An exception has occured when trying to set platform: {e}")
    
    def build_link(self):
        return f"{self.LINK}{'' if self.platform == 'all' else f'/platform-{self.platform}'}{'' if not self.tag else f'/tag-{self.tag}'}"

    def set_values_by_input(self):
        print(f"Platforms:")

        for platform, index in zip(self.PLATFORMS, range(len(self.PLATFORMS))):
            print(f"\t[{index}] {platform}")

        try:
            platform = int(input("Platform: "))
            platform = self.PLATFORMS[platform]
        except ValueError:
            print("Please enter a number value.")
            self.set_values_by_input()
        except IndexError:
            print(f"Please select a number between 0 and {len(self.PLATFORMS) - 1}")
            self.set_values_by_input()
        else:
            self.set_platform(platform)
            self.tag = input("Tag: ")

    def get_games(self):
        site_html = requests.get(self.build_link())

        soup = BeautifulSoup(site_html.text, "lxml")
        games = soup.findAll("div", class_="game_title")

        game_names = []
        for game in games:
            game_names.append(game.find("a", class_="game_link").text)

        if len(game_names) < 1:
            print(f"No games found for {self.platform if not self.platform == 'all' else 'all platforms'} with tag {self.tag}. Please check tag.")
        else:
            print(f"\n\t\tTop 10 games for {self.platform if not self.platform == 'all' else 'all platforms'} with tag {self.tag}\n")
            
            for game in range(10):
                print(game_names[game])
                print()

if __name__ == '__main__':
    scrape = ItchScraper()
    # scrape.set_platform(1)
    scrape.set_values_by_input()
    scrape.get_games()