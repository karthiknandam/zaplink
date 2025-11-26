PNPM = pnpm
PRISMA = $(PNPM) prisma

add:
	${PNPM} add motion next-themes

install_dev:
	${PNPM} install prisma --save-dev

dev:
	${PNPM} dev

build:
	${PNPM} build

start:
	${PNPM} start


#  for prisma

dlx:
	${PNPM} dlx prisma

# Here migrating should be make migrate name=init --> format

migrate:
	${PRISMA} migrate dev --name $(name)  

generate:
	${PRISMA} generate

studi:
	$(PRISMA) studio


# For nextjs clean up 

clean:
	rm -rf .next

