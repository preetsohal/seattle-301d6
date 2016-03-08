gitbranch () { echo -e "$(git branch --no-color 2> /dev/null | sed -e '/^[^*]/d')";}

yellow=$(tput setaf 3;tput bold)
green=$(tput setaf 2;tput bold)
red=$(tput setaf 1;tput bold)
blue=$(tput setaf 4;tput bold)
reset=$(tput sgr0;tput bold)
fullreset=$(tput sgr0)

set_bash_prompt(){
PS1="\`if [ \$? = 0 ]; then echo -e '\[$green\]\n\\h \xE2\x98\xBA'; else echo -e '\[$red\]\n\\h \xE2\x98\xB9'; fi\` \[$blue\]\[$reset\] \w \n\[$yellow\]$(gitbranch)\[$reset\] $ \[$fullreset\]"
}

PROMPT_COMMAND="set_bash_prompt"
