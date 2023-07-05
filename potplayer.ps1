Add-Type -Assembly System.Web
$path=$args[0]
$path=$path -replace "potplayer://" , ""
$path= [uri]::UnescapeDataString($path)
echo $path
& "C:\\Program Files\\DAUM\\PotPlayer\\PotPlayerMini64.exe" $path