# vscode-forcecomment README

This is the README for the extension "vscode-forcecomment". It can help you to comment from time to time. It can also remind you of each tomato!

## Usage

### Auto detect uncomment large blocks of codes

![propt](images/forcecomment.gif)

### Align comment

Command : `ForceComment: Align code`

Keyboard shortcut : `ctrl + shift + /`

![comment alignment](images/align.gif)

### Use Tomato Clock

![set-tomato-time](images/tomato.gif)

### Reset Tomato time

Command : `ForceComment: Set time for one tomato`

![set-tomato-time](images/changetomato.gif)

## Imported Commands

| Command                            | Title                                 | Description     |
| ---------------------------------- | ------------------------------------- | --------------- |
| `extension.forcecomment.aligncode` | ForceComment: Align code              | Align tail code |
| `extension.forcecomment.tomato`    | ForceComment: Set time for one tomato | Set a new timer |

## Activation Situations

Curruently only actived on `C/C++/Rust` codes.

## Known Issues

- no one has used it

## How to develop

- Clone the repository.
- In the repository, run `npm install`
- Open the repository using `Vscode` and then press `F5`
- Now you are debugging the extension!

## Release Notes

## v0.0.5
* fix a bug: if not turn on auto-save, the blame view will not change. (Great Thanks to cyy).

### v0.0.4

- add status bar for the tomato clock and can set time

### v0.0.2

* add blame message to prompt the user for comment
 
### v0.0.1

- Add a simple tail-comment alignment functionality

***

## Changes
[Change Log](./CHANGELOG.md)

## License
[BSD 3-Clause License](./LICENSE)


## Unofficial Author's Words
> This is the tool I wanted but could not find so wrote myself.
> 
> I hope you will enjoy it!