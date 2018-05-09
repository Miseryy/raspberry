set number
set nobackup
set noswapfile
set ambiwidth=double
set title
set t_Co=256
set clipboard=unnamed,autoselect
set ruler
set wildmenu
set showcmd
set hidden
"set list
"set listchars=tab:>-,extends:<,trail:-
set showmatch
set guioptions-=T
set encoding=utf-8
set fileencodings=iso-2022-jp,euc-jp,sjis,utf-8
set laststatus=2
set background=dark
set tabline=4
set shiftwidth=4
set tabstop=4
set softtabstop=4
set shellslash
set smartindent

set laststatus=2
set backspace=indent,eol,start

inoremap jj <ESC>
inoremap ( ()<LEFT>
inoremap { {}<LEFT>
inoremap [ []<LEFT>
inoremap < <><LEFT>
inoremap " ""<LEFT>
inoremap ' ''<LEFT>

inoremap () ()
inoremap {} {}
inoremap [] []
inoremap <> <>
inoremap "" ""
inoremap '' ''

nnoremap <ESC><ESC> :noh<CR><ESC>
nnoremap j gj
nnoremap k gk
nnoremap <Down> gj
nnoremap <Up>   gk

syntax on
