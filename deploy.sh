if [ "$1" = 'seed' ]; then
    printf "******** SEEDING DB WITH CONTENT IN /database/seed.js ********\n"
    printf "This action is IRREVERSIBLE and will DELETE existing data in database. Do you want to proceed? (y/n)"
    read choice
    if [ "$choice" = "y" ]; then
        printf "Deleting and seeding.....\n"
        cd database
        node seed.js
        printf "Done. Run ./deploy.sh flush if you want to delete all files also.\n"
    else
        printf "Operation aborted\n"
    fi

elif [ "$1" = 'build' ]; then
    printf "******** BUILDING FRONTEND FILES ********\n"
    cd public
    npm i
    npm run build
    printf "Done."

elif [ "$1" = "flush" ]; then
    printf "******** DELETING UPLOADED FILES ********\n"
    printf "******** This is IRREVERSIBLE. Do you want to proceed? (y/n)"
    read choice
    if [ "$choice" = "y" ]; then
        printf "Deleting all files\n"
        rm -rf temp/ uploads/ 
        printf "Done. Run ./deploy.sh seed if you want to delete all databse entries as well.\n" 
    else 
        printf "Operation aborted\n"
    fi

elif [ "$1" = "restart" ]; then
    pm2 restart bonafide
    printf "Done.\n"

elif [ "$1" = "deploy" ]; then
    pm2 start index.js --name 'bonafide' -i 0 #uses all possible cores
    printf 'bonafide daemon started\n'
fi
