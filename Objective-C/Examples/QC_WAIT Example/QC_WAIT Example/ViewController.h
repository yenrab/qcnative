//
//  ViewController.h
//  QC_WAIT Example
//
//  Created by Lee Barney on 9/18/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import <UIKit/UIKit.h>

@class QuickConnect;

@interface ViewController : UIViewController
@property (weak, nonatomic) IBOutlet UITextField *urlInut;
@property (strong, nonatomic) IBOutlet UIView *errorDisplay;
@property (weak, nonatomic) IBOutlet UIWebView *webDisplay;
@property (weak, nonatomic) IBOutlet UIImageView *sadSmiley;
@property (weak, nonatomic) IBOutlet UIImageView *happySmiley;

@property (strong, nonatomic) QuickConnect *theQuickConnect;

- (IBAction)loadURLDataFromWeb:(id)sender;

@end
